/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Weavy, WeavyOptions, WeavyType } from "../client/weavy";
import { globalContextProvider } from "@weavy/uikit-web";

/**
 * Hook for configuring a global weavy instance. 
 * It will reuse any previously available global weavy instance.
 * 
 * @param options { WeavyOptions } - Options for the weavy instance, the same as the weavy instance properties.
 * @returns Weavy instance
 */
export function useWeavy(options: WeavyOptions, deps: React.DependencyList = []) {
  const [weavy, setWeavy] = useState<WeavyType>();

  /**
   * Any option that is an instance/object needs to be memoized or converted.
   */
  const cacheSafeOptions: WeavyOptions = {
    ...options,
    cloudFilePickerUrl: options.cloudFilePickerUrl?.toString(),
    locales: useMemo(() => options.locales, [options.locales?.length]),
    tokenUrl: options.tokenUrl?.toString(),
    tokenFactory: useMemo(
      () => options.tokenFactory,
      [options.tokenFactory?.toString(), ...deps]
    ),
    url: options.url?.toString(),
  };

  const [prevOptions, setPrevOptions] =
    useState<WeavyOptions>(cacheSafeOptions);

  useEffect(() => {
    if (!weavy) {
      const globalWeavy = globalContextProvider?.value;
      const wy = globalWeavy ?? new Weavy(cacheSafeOptions);
      setWeavy(wy);

      /*console.log(
        "useWeavy",
        globalWeavy ? "using global instance" : "created new instance",
        wy?.weavySid
      );*/
    }
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
