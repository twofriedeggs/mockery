name: Feature Request
description: Create a feature request for Mockery
labels: 'template: story'
body:
  - type: markdown
    attributes:
      value: Thanks for taking the time to file a feature request! Please fill out this form as completely as possible.
  - type: textarea
    attributes:
      label: Describe the feature/improvement you'd like to request
      description: A clear and concise description of what you would like and what your use case is.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Describe alternatives you've considered
      description: A clear and concise description of any alternative solutions or features you've considered.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Additional context
      description: Any other information about the feature request that hasn't been covered already.
