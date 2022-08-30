export interface IWrite<T> {
    create(item: T): Promise<string>;

    update(id: string, item: T): Promise<string>;

    delete(id: string): Promise<string>;
}