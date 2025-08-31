export function generateRandomString(
  length: number,
  type: ('ALL' | 'NUMBER' | 'UPPER' | 'LOWER' | 'SYMBOL')[],
) {
  let characters: string = '';

  const uniqueType = [...new Set(type)];

  if (uniqueType.includes('ALL')) {
    characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/`~';
  }

  uniqueType.forEach((type) => {
    switch (type) {
      case 'UPPER':
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'LOWER':
        characters += 'abcdefghijklmnopqrstuvwxyz';
        break;
      case 'NUMBER':
        characters += '0123456789';
        break;
      case 'SYMBOL':
        characters += '!@#$%^&*()_+[]{}|;:,.<>?/`~';
        break;
      default:
        break;
    }
  });

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function insertString(str: string, position: number, insertStr: string) {
  if (str === null) {
    return null;
  }

  return str.substring(0, position) + insertStr + str.substring(position);
}
