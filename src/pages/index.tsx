import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Bucket } from "sst/node/bucket";
import styles from "@/styles/Home.module.css";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps() {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: Bucket.public.bucketName,
  });
  const url = await getSignedUrl(new S3Client({}), command);
  const bucketName = Bucket.public.bucketName
  console.log(bucketName)
  return { props: { url } };
}

export default function Home({ url }: { url: string }) {
  return (
    <main className={styles.main}>
     <div className={styles.center}>
        <a
          href="https://5minslearn.gogosoon.com/?ref=github_sst_app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            5minslearn <span>-&gt;</span>
          </h2>
          <p className={inter.className}>Learn tech in 5mins</p>
        </a>

        
      </div>
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          const file = (e.target as HTMLFormElement).file.files?.[0]!;

          const image = await fetch(url, {
            body: file,
            method: "PUT",
            headers: {
              "Content-Type": file.type,
              "Content-Disposition": `attachment; filename="${file.name}"`,
            },
          });

          window.location.href = image.url.split("?")[0];
        }}
      >
        <input name="file" type="file" accept="image/png, image/jpeg" />
        <button type="submit" className={inter.className}>
          Upload
        </button>
      </form>
    </main>
  );
}
