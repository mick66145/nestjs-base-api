import { Constructor, Wrapper } from '../utils/interface/common.type';

type DecoratorOptions = { name?: string; prefix?: string; delimiter?: string };
type ApiSchemaDecorator = <T extends Constructor>(
  options: DecoratorOptions,
) => (constructor: T) => Wrapper<T>;

export const ApiSchema: ApiSchemaDecorator = ({
  name,
  prefix,
  delimiter = '.',
}) => {
  return (constructor) => {
    const wrapper = constructor;
    name = name ?? constructor.name;
    prefix = prefix ?? '';
    Object.defineProperty(wrapper, 'name', {
      value: prefix + delimiter + name,
      writable: false,
    });
    return wrapper;
  };
};
