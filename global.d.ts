import { ThreeElements } from '@react-three/fiber';

// Augment the 'react' module's JSX namespace to include R3F elements
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// ----------------------------------------------------
// IMAGE IMPORT MODULE DECLARATIONS
// ----------------------------------------------------

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}