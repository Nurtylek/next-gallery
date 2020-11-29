import {useEffect, useState} from "react";
import {AppShell} from "@/components/app-shell/app-shell";
import styles from '../styles/Home.module.css';
import Image from "next/image";

export default function Home({photos}) {
    const [searchPhotos, setSearchPhotos] = useState([]);

    const search = async (searchTerm: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}search/photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&query=${searchTerm}`, {
                headers: {
                    'Accept-Version': 'v1'
                },
            });
            const data = await res.json();
            setSearchPhotos(data.results);
        } catch (e) {
            console.log({e})
        }
    }

    useEffect(() => {
        setSearchPhotos(photos);
    }, [])

    return (
        <AppShell title={'Create Next App'} search={searchTerm => search(searchTerm)}>
            <section className={styles.main__content}>
                {searchPhotos.map(photo => {
                    return (
                        <figure key={photo.id}>
                            <Image
                                objectFit="cover"
                                src={photo.urls.regular}
                                width={photo.width}
                                height={photo.height}
                                alt={photo.alt_description}
                            />
                        </figure>
                    )
                })}
            </section>
        </AppShell>
    )
}

export async function getStaticProps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&page=1&per_page=24`)
    const data = await res.json();

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            photos: data
        }
    }
}
