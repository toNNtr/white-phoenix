import type {
    ContainerObserver,
    ObserverProxyBase,
    ObserverTargetCallback,
    TargetCallback,
    UseObserver,
} from "./types";

export const observers: ContainerObserver[] = [];

class ObserverProxy implements ObserverProxyBase {
    observer: IntersectionObserver;
    targetCallbacks: TargetCallback[] = [];

    constructor(root?: Element | Document | null) {
        this.observer = new IntersectionObserver(
            (entries) => {
                for (let observerTarget of this.targetCallbacks) {
                    const entry = entries.find((elem) => elem.target === observerTarget.target);

                    if (entry) {
                        for (let callback of observerTarget.callbacks) {
                            callback?.(entry, this);
                        }
                    }
                }
            },
            {
                root: root,
                rootMargin: "0px 0px 25px 0px",
            },
        );
    }

    async observe(params: { target: Element }, callback?: ObserverTargetCallback) {
        const existingTarget = this.targetCallbacks.find((elem) => elem.target === params.target);

        if (!existingTarget) {
            const callbacks = callback ? [callback] : [];
            this.targetCallbacks.push({
                target: params.target,
                callbacks,
            });

            this.observer.observe(params.target);
            return;
        }

        const existingTargetCallback = existingTarget.callbacks.find((elem) => elem === callback);

        if (!existingTargetCallback) {
            existingTarget.callbacks.push(callback);
        }
    }

    unobserve(params: { target: Element }, callback?: ObserverTargetCallback) {
        const existingTargetIndex = this.targetCallbacks.findIndex(
            (elem) => elem.target === params.target,
        );

        if (existingTargetIndex >= 0) {
            const existingTarget = this.targetCallbacks[existingTargetIndex];
            const existingTargetCallbackIndex = existingTarget.callbacks.findIndex(
                (elem) => elem === callback,
            );

            if (existingTargetCallbackIndex >= 0) {
                existingTarget.callbacks.splice(existingTargetCallbackIndex, 1);

                if (existingTarget.callbacks.length === 0) {
                    this.targetCallbacks.splice(existingTargetIndex, 1);
                    this.observer.unobserve(params.target);
                }
            }
        }
    }
}

export const useObserver: UseObserver = (observerParams) => {
    const containerObserver = observers.find((elem) => elem.root === observerParams?.root);

    if (containerObserver) {
        return containerObserver.observerProxy;
    } else {
        const newContainerObserver = {
            root: observerParams?.root,
            observerProxy: new ObserverProxy(observerParams?.root),
        };

        observers.push(newContainerObserver);

        return newContainerObserver.observerProxy;
    }
};
