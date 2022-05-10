import fs from 'fs/promises';
import { Stats } from 'fs';
import { TSConfigRepository } from '@/repositories/tsconfig';

describe('🚓 TSConfigRepository', () => {
  describe('🚓 save', () => {
    it('👮 改行文字を加えてファイルに出力する', async () => {
      // lstat がファイルが存在しないと解釈するように reject させる挙動でモック
      jest.spyOn(fs, 'lstat').mockImplementation(() => Promise.reject());

      const spyOfWriteFile = jest
        .spyOn(fs, 'writeFile')
        .mockImplementation(() => Promise.resolve());

      const tsconfig = new TSConfigRepository();
      await tsconfig.save();

      const expectedJSON =
        JSON.stringify(
          {
            compilerOptions: {
              module: 'commonjs',
              target: 'ES2018',
              sourceMap: true,
              strict: true,
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              rootDir: './',
              baseUrl: './src',
              paths: {
                '@/*': ['./*'],
              },
              types: ['@types/jest', '@types/node'],
            },
            include: ['src/**/*'],
            exclude: ['node_modules'],
          },
          null,
          2
        ) + '\n';

      expect(spyOfWriteFile).toHaveBeenCalledWith(
        'tsconfig.json',
        expectedJSON,
        {
          encoding: 'utf8',
        }
      );
    });

    it('👮 ファイルが存在する場合はエラーを返す', async () => {
      // lstat がファイルが存在すると解釈するようにモック
      jest
        .spyOn(fs, 'lstat')
        .mockImplementation(() => Promise.resolve({} as Stats));

      const tsconfig = new TSConfigRepository();

      await expect(tsconfig.save()).rejects.toThrowError(
        new Error('tsconfig.json file already exist!')
      );
    });
  });
});
