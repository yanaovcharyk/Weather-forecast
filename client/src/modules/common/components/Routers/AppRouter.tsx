import { Routes, Route } from 'react-router-dom';
import { registry } from './registry';
import { applyGuards } from './guards';
import { ErrorBoundary } from '@/logger/components/ErrorBoundary/ErrorBoundary';

export const AppRouter = () => {
  const routes = registry.flatMap((module) => module.routes);

  return (
    <Routes>
      {routes.map((route, i) => {
        const Component = route.component;
        const element = <Component />;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <ErrorBoundary>{applyGuards(route, element)}</ErrorBoundary>
            }
          />
        );
      })}
    </Routes>
  );
};
