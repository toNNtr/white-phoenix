export type TargetCallback = {
    target: Element;
    callbacks: (ObserverTargetCallback | undefined)[];
};

export type ContainerObserver = {
    root?: Element | Document | null;
    observerProxy: ObserverProxyBase;
};

export interface ObserverProxyBase {
    readonly observer: IntersectionObserver;
    observe: ObserveMethod;
    unobserve: UnobserveMethod;
}

export type UseObserver = (params?: { root?: Element | Document | null }) => ObserverProxyBase;

export type ObserverTargetCallback = (
    entry: IntersectionObserverEntry,
    observerProxy: ObserverProxyBase,
) => void;
export type ObserveMethod = (
    params: {
        target: Element;
    },
    callback?: ObserverTargetCallback,
) => Promise<void>;
export type UnobserveMethod = (
    params: { target: Element },
    callback?: ObserverTargetCallback,
) => void;
