type Dictionary = {
  [key: string]: string | Dictionary;
};

const Dict: Dictionary = {
  app: {
    firstName: 'BeDee',
    lastName: 'Examination',
  },
  button: {
    reset: 'Try Again',
  },
  label: {
    loading: 'Loading..',
    score: 'Your Score',
  },
  error: {
    unknown: 'An error occured',
  },
  gradeDescription: {
    a: 'Excellent!',
    bPlus: 'Very Good',
    b: 'Good',
    cPlus: 'Fairly Good',
    c: 'Fair',
    dPlus: 'Poor',
    d: 'Very Poor',
    f: 'Fail',
  },
};

export function getDict(...keys: string[]): string | undefined {
  let value: any = Dict;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    value = value[key];
    if (value === undefined) return undefined;
  }
  return value;
}
