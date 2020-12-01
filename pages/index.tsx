import {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {AppShell} from "@/components/app-shell/app-shell";
import styles from '../styles/Home.module.css';
import {defaultQueryFn} from "@/lib/api-hooks";

export default function Home({photos}) {
    const [, setSearchTerm] = useState('');
    const [searchPhotos, setSearchPhotos] = useState([]);

    const search = useCallback(async (searchTerm: string) => {
        try {
            setSearchTerm(searchTerm);
            const res = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}search/photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&query=${searchTerm}`)
            setSearchPhotos(res.results);
        } catch (e) {
            console.log({e})
        }
    }, []);

    useEffect(() => {
        setSearchPhotos(photos);
    }, []);

    const observer = useRef<IntersectionObserver>();
    const [element, setElement] = useState(null);

    useEffect(() => {
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log(entries)
            }
        }, {threshold: 1})
    }, []);

    useEffect(() => {

        const currentElement = element;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        }
    }, [element])

    return (
        <AppShell title={'Create Next App'} search={searchTerm => search(searchTerm)}>
            {searchPhotos.length && (
                <section className={styles.main__content}>
                    <>
                        {searchPhotos.map(photo => {
                            return (
                                <figure key={photo.id + photo}>
                                    <Image
                                        src={photo.urls.regular}
                                        alt={photo.alt_description}
                                        width={photo.width}
                                        height={photo.height}
                                    />
                                </figure>
                            )
                        })}
                        <div ref={setElement}><button>Load More</button></div>
                    </>
                </section>
            )}
        </AppShell>
    )
}

export async function getStaticProps() {
    const data = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&page=1&per_page=12`)
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
