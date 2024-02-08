import { useEffect, useMemo, useState } from "react";
import { Weavy } from "@weavy/uikit-web";
import { WeavyOptions } from "@weavy/uikit-web/dist/types/types/weavy.types";

export function useWeavy(options: WeavyOptions) {
  const [weavy, setWeavy] = useState<Weavy>();

  const cacheSafeOptions: WeavyOptions = {
    ...options,
    cloudFilePickerUrl: options.cloudFilePickerUrl?.toString(),
    localesUrl: options.localesUrl?.toString(),
    localizedTemplates: useMemo(() => options.localizedTemplates, [options.localizedTemplates?.size]),
    tokenUrl: options.tokenUrl?.toString(),
    tokenFactory: useMemo(() => options.tokenFactory, [options.tokenFactory?.toString()]),
    url: options.url?.toString(),
    zoomAuthenticationUrl: options.url?.toString(),
  };

  const [prevOptions, setPrevOptions] = useState<WeavyOptions>(cacheSafeOptions);

  useEffect(() => {
    const wy = new Weavy(cacheSafeOptions);
    setWeavy(wy);

    return () => {
      wy?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Apply changed options when instance already exists
    if (weavy && !weavy.isDestroyed) {
      const validProperties = {} as WeavyOptions;

      Object.entries(cacheSafeOptions).forEach(([key, value]) => {
        if (value !== prevOptions[key as keyof WeavyOptions]) {
          Object.assign(validProperties, { [key]: value });
        }
      });

      if (Object.keys(validProperties).length) {
        //console.log("WeavyOptions", weavy?.weavySid, validProperties);
        setPrevOptions(cacheSafeOptions);
        Object.assign(weavy, validProperties);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheSafeOptions]);

  return weavy;
}

