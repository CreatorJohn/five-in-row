import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Import all components from the Pages directory
const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });

document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('app');
    if (!rootElement) return;

    // Get the component name and props from the data-page attribute
    const data = rootElement.getAttribute('data-page');
    if (!data) return;

    const { component, props } = JSON.parse(data);
    
    // Resolve the component from the pages object
    const page = pages[`./Pages/${component}.tsx`] as any;

    if (page && page.default) {
        const RootComponent = page.default;
        
        // Wrapped component to handle side effects like page title
        const AppWrapper = (appProps: any) => {
            useEffect(() => {
                if (appProps.title) {
                    document.title = `${appProps.title} | Five in a Row | Creator John`;
                }
            }, [appProps.title]);

            return <RootComponent {...appProps} />;
        };

        const root = createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <AppWrapper {...props} />
            </React.StrictMode>
        );
    } else {
        console.error(`Component "${component}" not found in resources/js/Pages. Available:`, Object.keys(pages));
    }
});
