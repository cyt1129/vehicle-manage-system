// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  // serverUrl: "192.168.66.165:8080",
  //  serverUrl: "106.14.114.91:8080",
   serverUrl: 'http://140.143.23.199:8080/api',
  tokenExpireTime: 1500
};
