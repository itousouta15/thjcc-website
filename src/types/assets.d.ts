// Small SVGs explicitly embedded as data URLs for first-paint UI.
declare module "*.svg?inline" {
  const dataUrl: string;
  export default dataUrl;
}
