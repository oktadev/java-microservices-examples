import axios, { AxiosPromise } from 'axios';

export default class LoginService {
  public login(loc = window.location) {
    const port = loc.port ? ':' + loc.port : '';
    let contextPath = location.pathname;
    if (contextPath.endsWith('accessdenied')) {
      contextPath = contextPath.substring(0, contextPath.indexOf('accessdenied'));
    }
    if (contextPath.endsWith('forbidden')) {
      contextPath = contextPath.substring(0, contextPath.indexOf('forbidden'));
    }
    if (!contextPath.endsWith('/')) {
      contextPath = contextPath + '/';
    }
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    loc.href = `//${loc.hostname}${port}${contextPath}oauth2/authorization/oidc`;
  }

  public logout(): AxiosPromise<any> {
    return axios.post('api/logout');
  }
}
