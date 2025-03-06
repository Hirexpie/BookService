export function bindMethods<T extends object>(instance: T): void {
    const prototype = Object.getPrototypeOf(instance);
    Object.getOwnPropertyNames(prototype).forEach((method) => {
    if (typeof (instance as any)[method] === "function") {
        (instance as any)[method] = (instance as any)[method].bind(instance);
    }
    });
}