'use client';

import { SocialPlatform } from '@/types';
import download from 'downloadjs';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  FaArrowRotateLeft,
  FaDownload,
  FaGithub,
  FaGitlab,
  FaXTwitter,
  FaBluesky,
} from 'react-icons/fa6';

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const [userImageUrl, setUserImageUrl] = useState<string>();
  const [unsupportedBrowser, setUnsupportedBrowser] = useState(false);
  const [loader, setLoader] = useState(false);
  const [filePostfix, setFilePostfix] = useState<
    SocialPlatform | 'user-upload'
  >();

  useEffect(() => {
    const isInstagramBrowser = /Instagram/i.test(navigator.userAgent);
    const isFacebookBrowser = /FBAN|FBAV/i.test(navigator.userAgent);

    if (isInstagramBrowser || isFacebookBrowser) {
      setUnsupportedBrowser(true);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      setFilePostfix('user-upload');
      setUserImageUrl(event.target?.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleUploadButtonClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleRetrieveProfilePicture = async (platform: SocialPlatform) => {
    const userProvidedUsername = prompt(`Enter your ${platform} username:`);
    if (!userProvidedUsername) return;

    setFilePostfix(platform);

    try {
      setLoader(true);
      const response = await fetch(
        `/api/retrieve-profile-pic?username=${encodeURIComponent(
          userProvidedUsername,
        )}&platform=${encodeURIComponent(platform)}`,
      ).then((res) => (res.ok ? res.json() : null));

      if (!response) {
        alert(
          'Error fetching your profile picture. Please check the username.',
        );
        return;
      }

      setUserImageUrl(response.profilePicUrl);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    } finally {
      setLoader(false);
    }
  };

  const generateImage = async () => {
    try {
      return await toPng(ref.current as HTMLElement);
    } catch (error) {
      console.log('Error generating image', error);
    }
  };

  const handleDownload = async () => {
    await generateImage();
    await generateImage();
    const generatedImageUrl = await generateImage();

    if (generatedImageUrl) {
      download(
        generatedImageUrl,
        `profile-pic-${filePostfix ?? 'kurdistan'}.png`,
      );
    }
  };

  const startOver = () => {
    setUserImageUrl(undefined);
    setFilePostfix(undefined);
  };

  return (
    <main className="text-center px-8 py-12 max-w-xl mx-auto flex justify-center items-center min-h-screen">
      <div>
        {unsupportedBrowser && (
          <div className="border p-2 rounded-lg bg-yellow-200 my-2 text-sm mb-8">
            <p className="font-semibold">⚠️ Unsupported Browser Detected</p>
            <p>Please open this page in Chrome or Safari.</p>
          </div>
        )}

        <h1 className="font-semibold text-3xl mt-6">
          Kurdistan Profile Pic Maker ☀️
        </h1>
        <p className="text-lg py-2">
          Frame your profile picture with the colors of Kurdistan.
        </p>

        <div className="my-12">
          <div className="flex justify-center">
            <div
              ref={ref}
              className="relative"
              style={{ width: '300px', height: '300px' }}
            >
              <Image
                src="/bg4.svg"
                alt="border"
                width={300}
                height={300}
                className="rounded-full"
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                unoptimized
              />

              {loader ? (
                <Image
                  src="/spinner.svg"
                  alt="loading"
                  width={300}
                  height={300}
                  className="rounded-full object-cover"
                  style={{
                    position: 'absolute',
                    width: '85%',
                    height: '85%',
                    left: '7.5%',
                    top: '7.5%',
                  }}
                />
              ) : (
                <Image
                  src={userImageUrl ?? '/user.jpg'}
                  alt="profile"
                  width={300}
                  height={300}
                  className="rounded-full object-cover cursor-pointer"
                  style={{
                    position: 'absolute',
                    width: '85%',
                    height: '85%',
                    left: '7.5%',
                    top: '7.5%',
                  }}
                  unoptimized
                />
              )}
            </div>
          </div>
        </div>

        <div>
          {userImageUrl ? (
            <>
              <p className="p-2 my-6 text-sm border rounded-lg">
                Download the image and use it as your new profile picture.
              </p>

              <button
                onClick={handleDownload}
                className="rounded-full mb-2 py-3 w-full border border-gray-900 bg-gray-900 text-white text-xl"
              >
                Download Image <FaDownload className="inline mb-1 ml-2" />
              </button>

              <button
                onClick={startOver}
                className="rounded-full my-2 py-3 w-full border border-gray-900 text-xl"
              >
                Start Over <FaArrowRotateLeft className="inline mb-1 ml-2" />
              </button>
            </>
          ) : (
            <>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={handleUploadButtonClick}
                className="rounded-full my-2 py-3 w-full border border-gray-900 text-xl"
              >
                Upload Image
              </button>

              <button
                onClick={() =>
                  handleRetrieveProfilePicture(SocialPlatform.Twitter)
                }
                className="rounded-full my-2 py-3 w-full border border-gray-900 text-xl"
              >
                Use <FaXTwitter className="inline mb-1" /> Profile Pic
              </button>

              <button
                onClick={() =>
                  handleRetrieveProfilePicture(SocialPlatform.Github)
                }
                className="rounded-full my-2 py-3 w-full border border-gray-900 text-xl"
              >
                Use <FaGithub className="inline mb-1" /> Profile Pic
              </button>

              <button
                onClick={() =>
                  handleRetrieveProfilePicture(SocialPlatform.Gitlab)
                }
                className="rounded-full my-2 py-3 w-full border border-gray-900 text-xl"
              >
                Use <FaGitlab className="inline mb-1" /> Profile Pic
              </button>

              <button
                onClick={() =>
                  handleRetrieveProfilePicture(SocialPlatform.Bluesky)
                }
                className="rounded-full my-2 py-3 w-full border border-gray-900 text-xl"
              >
                Use <FaBluesky className="inline mb-1" /> Profile Pic
              </button>
            </>
          )}
        </div>

        <div className="pt-8">
          <p className="p-2 my-6 text-sm border rounded-lg">
            Runs entirely in your browser. No images or data are stored.
          </p>

          <p className="text-gray-600">
            Bugs or feedback:{' '}
            <a
              href="https://github.com/anildn777/profile-pic-maker-kurdistan/issues"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              GitHub Issues
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
