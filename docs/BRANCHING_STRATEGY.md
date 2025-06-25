# Git Branching Strategy

## Branch Structure

### Main Branches
- **`main`**: Production-ready code. All releases are tagged from this branch.
- **`develop`**: Integration branch where features are merged for testing.

### Supporting Branches
- **`feature/*`**: Feature development branches (e.g., `feature/uwb-localization`)
- **`bugfix/*`**: Bug fix branches (e.g., `bugfix/sensor-calibration`)
- **`hotfix/*`**: Critical fixes that need immediate deployment
- **`release/*`**: Release preparation branches

## Workflow

### Feature Development
1. Create feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Work on feature, commit regularly with descriptive messages

3. Create Pull Request to merge into `develop`

4. After review and approval, merge into `develop`

### Release Process
1. Create release branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b release/v1.0.0
   ```

2. Final testing and bug fixes on release branch

3. Merge release branch into both `main` and `develop`

4. Tag release on `main`:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   ```

### Hotfixes
1. Create hotfix branch from `main`:
   ```bash
   git checkout main
   git checkout -b hotfix/critical-fix
   ```

2. Fix the issue and test thoroughly

3. Merge into both `main` and `develop`

## Branch Protection Rules
- `main` branch requires PR reviews
- Direct pushes to `main` are disabled
- Status checks must pass before merging
- Branch must be up to date before merging

## Naming Conventions
- Use lowercase with hyphens: `feature/uwb-sensor-integration`
- Include issue number when applicable: `feature/123-add-obstacle-avoidance`
- Be descriptive but concise

## Commit Message Format
```
type(scope): brief description

Detailed explanation (if needed)

- List specific changes
- Reference issues: Closes #123

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks