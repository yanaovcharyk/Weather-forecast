import { Routes, Route } from 'react-router-dom';
import { registry } from './registry';
import { applyGuards } from './guards';

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
            element={applyGuards(route, element)}
          />
        );
      })}
    </Routes>
  );
};
