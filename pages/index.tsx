import { useEffect, useRef, useState} from "react";
import Image from "next/image";
import {AppShell} from "@/components/app-shell/app-shell";
import styles from '../styles/Home.module.css';
import {defaultQueryFn} from "@/lib/api-hooks";

export default function Home({photos}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPhotos, setSearchPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver>();
    const [element, setElement] = useState(null);

    const search = async () => {
        try {
            const res = await defaultQueryFn(`${process.env.NEXT_PUBLIC_API_URL}search/photos?client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}&query=${searchTerm}&page=${page}&per_page=12`)
            setSearchPhotos(photos => {
                // debug purposes
                return [...photos, ...res.results]
            });
        } catch (e) {
            console.log({e})
        }
    }

    useEffect(() => {

        if (searchTerm) {
            search();
            console.log(searchTerm)
        }

    }, [searchTerm, page]);

    useEffect(() => {
        setSearchPhotos(photos);
    }, []);

    useEffect(() => {
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(oldPage => oldPage + 1);
            }
        }, {threshold: 0.5, rootMargin: '200px 0px 0px 0px'})
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
        <AppShell title={'Create Next App'} search={searchTerm => setSearchTerm(searchTerm)}>
            {searchPhotos.length && (
                <>
                    <section className={styles.main__content}>
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
                    </section>
                    <div ref={setElement}><button>Load More</button></div>
                </>
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
