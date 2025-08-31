export class ResourceListEntity<T> {
  constructor(data: Array<T>, meta: any = undefined) {
    Object.assign(this, {
      list: data,
      meta,
    });
  }

  list!: Array<T>;

  meta: any;
}
