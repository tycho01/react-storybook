import Preview from './ui/preview';
import { getSyncedStore } from './';

getSyncedStore().watchData((data) => `<preview></preview>`);

/*

Apparently I'll need to render a component from a React-style `(data)` function.
How can I inject (data) its @Inputs and dependencies? Use `test_comp` wrapper component.
A component isn't HTML though. It needs either:
- DCL injection in a bootstrapped component,
- or an invocation and bootstrap.

*/
