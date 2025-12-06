# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Getting Started

1.  **Navigate to your project:**
    ```bash
    cd {{PROJECT_SLUG}}
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```

3.  **Start development server:**
    ```bash
    php moo dev
    ```

    This will start a development server with BrowserSync and live reloading.
    Your site will be proxied at `http://{{PROJECT_SLUG}}.test` (or as configured in `wpmoo-config.yml`).

## Deployment

When you are ready to deploy your {{PROJECT_TYPE}} for production, run the following command:

```bash
php moo dist
```

This will create a distributable `.zip` file in the `dist/` directory, with all necessary assets and the WPMoo framework (scoped to your {{PROJECT_TYPE}}'s namespace) included.

## Configuration

You can customize various development settings in `wpmoo-config.yml`.
