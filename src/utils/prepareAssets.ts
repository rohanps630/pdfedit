type ScriptName =
  | 'pdfjsLib'
  | 'PDFLib'
  | 'download'
  | 'makeTextPDF'
  | 'w3Color';

interface Script {
  name: ScriptName;
  src: string;
}

interface Assets {
  [key: string]: Promise<any>;
}

const assets: Assets = {};

export const getAsset = <T>(scriptName: ScriptName): Promise<T> => {
  return assets[scriptName] as Promise<T>;
};

export const prepareAssets = (): void => {
  scripts.forEach(({ name, src }) => {
    const promise = new Promise<any>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(window[name as any]);
        console.log(`${name} is loaded.`);
      };
      script.onerror = () =>
        reject(new Error(`The script ${name} didn't load correctly.`));
      document.body.appendChild(script);
    });

    assets[name] = promise;
  });
};

interface Font {
  src?: string;
  correction: (size: number, lineHeight: number) => number;
  buffer?: ArrayBuffer;
}


interface Fonts {
  [key: string]: Font;
}

const fonts: Fonts = {
  Courier: {
    correction(size: number, lineHeight: number) {
      return (size * lineHeight - size) / 2 + size / 6;
    },
  },
  Helvetica: {
    correction(size: number, lineHeight: number) {
      return (size * lineHeight - size) / 2 + size / 10;
    },
  },
  'Times-Roman': {
    correction(size: number, lineHeight: number) {
      return (size * lineHeight - size) / 2 + size / 7;
    },
  },
};

export const Fonts: Fonts = {
  ...fonts,
  標楷體: {
    src: '/CK.ttf', // 9.9 MB
    correction(size: number, lineHeight: number) {
      return (size * lineHeight - size) / 2;
    },
  },
};

export const fetchFont = async (name: string): Promise<Font> => {
  if (fonts[name]) {
    return fonts[name];
  }

  const font = Fonts[name as keyof Fonts];
  if (!font) {
    throw new Error(`Font '${name}' does not exist.`);
  }

  const response = await fetch(font.src);
  const fontBuffer = await response.arrayBuffer();
  const fontFace = new FontFace(name, fontBuffer);
  fontFace.display = 'swap';
  await fontFace.load();
  document.fonts.add(fontFace);

  const updatedFont: Font = {
    ...font,
    buffer: fontBuffer,
  };

  fonts[name] = updatedFont;

  return updatedFont;
};

// Define your scripts and fonts here
const scripts: Script[] = [
  {
    name: 'pdfjsLib',
    src: 'https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.min.js',
    // src: '../lib/pdf.min.js',
  },
  {
    name: 'PDFLib',
    src: 'https://unpkg.com/pdf-lib@1.4.0/dist/pdf-lib.min.js',
    // src: '../lib/pdf-lib.min.js',
  },
  {
    name: 'download',
    src: 'https://unpkg.com/downloadjs@1.4.7',
    // src: '../lib/download.js',
  },
  {
    name: 'makeTextPDF',
    src: 'https://cdn.jsdelivr.net/gh/snamoah/react-pdf-editor/public/makeTextPDF.js',
    // src: '../lib/makeTextPDF.js',
  },
  {
    name: 'w3Color',
    src: 'https://www.w3schools.com/lib/w3color.js',
    // src: '../lib/w3color.js',
  },
];
