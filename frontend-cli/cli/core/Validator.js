export class Validator {
  validate(value) {
    throw new Error('Method validate() must be implemented')
  }
}

export class RequiredValidator extends Validator {
  constructor(message = 'This field is required') {
    super()
    this.message = message
  }

  validate(value) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return this.message
    }
  }
}

export class RegexValidator extends Validator {
  constructor(pattern, message) {
    super()
    this.pattern = pattern
    this.message = message
  }

  validate(value) {
    if (value && !this.pattern.test(value)) {
      return this.message
    }
  }
}

export class ProjectNameValidator extends Validator {
  validate(value) {
    const requiredValidator = new RequiredValidator('Project name is required')
    const requiredError = requiredValidator.validate(value)
    if (requiredError) return requiredError

    const regexValidator = new RegexValidator(
      /^[a-z0-9-]+$/,
      'Project name must only contain lowercase letters, numbers, and hyphens'
    )
    return regexValidator.validate(value)
  }
}

export class CompositeValidator extends Validator {
  constructor(validators = []) {
    super()
    this.validators = validators
  }

  addValidator(validator) {
    this.validators.push(validator)
  }

  validate(value) {
    for (const validator of this.validators) {
      const error = validator.validate(value)
      if (error) return error
    }
  }
}
