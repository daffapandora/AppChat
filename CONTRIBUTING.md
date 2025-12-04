# Contributing to AppChat

Thank you for your interest in contributing to AppChat! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Device/OS information**
- **App version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why would this be useful?
- **Possible implementation** (optional)
- **Mockups or examples** (if applicable)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/daffapandora/AppChat.git
   cd AppChat
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

## Development Setup

### Prerequisites

- Node.js >= 20
- React Native development environment
- Android Studio or Xcode
- Firebase account

### Installation

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AppChat.git
   cd AppChat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase (see README.md)

4. Run the app:
   ```bash
   npm run android
   # or
   npm run ios
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible

### React Native Components

- Use functional components with hooks
- Follow component naming: `PascalCase.tsx`
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### File Structure

```
AppChat/
├── components/         # Reusable components
├── screens/            # Screen components
├── types/              # TypeScript types
├── utils/              # Utility functions
├── hooks/              # Custom hooks (if needed)
└── __tests__/          # Test files
```

### Styling

- Use StyleSheet.create() for component styles
- Keep styles at the bottom of the file
- Use meaningful style names
- Follow design consistency

### Code Formatting

- Run ESLint before committing:
  ```bash
  npm run lint
  ```

- Use Prettier for formatting (configured in project)

## Testing

### Writing Tests

- Write tests for new features
- Update tests when modifying existing code
- Use descriptive test names
- Test both success and error cases

### Running Tests

```bash
npm test
```

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for complex functions
- Update type definitions when needed
- Include code examples for new APIs

## Firebase Changes

- Don't commit Firebase config files
- Update `.env.example` if adding new env variables
- Document Security Rules changes in FIREBASE_RULES.md
- Test security rules before deploying

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Added/updated tests for changes
- [ ] Updated documentation
- [ ] No console.log statements left
- [ ] Commits follow conventional commit format

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug?** Create an Issue
- **Feature idea?** Create an Issue with enhancement label

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to AppChat! 🚀
