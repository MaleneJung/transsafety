import { ref } from 'vue'

export enum Route {
  List,
  Create,
  Unlocked,
}

export const ROUTER = {
  go: (route: Route, data?: string) => {
    sessionStorage.setItem(
      'router-route',
      JSON.stringify({
        route: route,
      }),
    )
    if (typeof data !== 'undefined') sessionStorage.setItem('router-data', data)
    else sessionStorage.removeItem('router-data')
    routeState.value = route
  },
  getCurrentRoute: () =>
    JSON.parse(sessionStorage.getItem('router-route') ?? '{"route": 0}').route as Route,
  getCurrentData: () => sessionStorage.getItem('router-data') ?? undefined,
}

export let routeState = ref(ROUTER.getCurrentRoute())
