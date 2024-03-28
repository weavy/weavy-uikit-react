/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Weavy } from "@weavy/uikit-web";
import type { WeavyContext } from "@weavy/uikit-web/dist/types/index";
import { WeavyOptions } from "@weavy/uikit-web/dist/types/types/weavy.types";

export function useWeavy(options: WeavyOptions) {
  const [weavy, setWeavy] = useState<WeavyContext>();

  const cacheSafeOptions: WeavyOptions = {
    ...options,
    cloudFilePickerUrl: options.cloudFilePickerUrl?.toString(),
    locales: useMemo(() => options.locales, [options.locales?.length]),
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
  }, [cacheSafeOptions]);

  return weavy;
}

