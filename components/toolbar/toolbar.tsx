import React, {FC, memo, MutableRefObject, useEffect, useRef, useState} from 'react';
import styles from './toolbar.module.css';
import Image from "next/image";
import {useOnClickOutside} from "@/lib/use-on-click-outside";
import {NextLink} from "@/components/typography/typography";
import {AnimatePresence, motion} from "framer-motion";

type ToolbarProps = {
    photoChange: (photo: string) => void
};

export const Toolbar: FC<ToolbarProps> = memo(({photoChange}) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [words] = useState(
        'WallpapersTextures & Patterns Nature Current Events Architecture Business & Work Film Animals Travel'
    )
    const divRef = useRef();
    useOnClickOutside(divRef, () => {
        if (divRef.current) {
            setIsSearchOpen(false);
            setSearchTerm('')
        }
    });

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        const delay = setTimeout(() => {
            if (searchTerm) {
                photoChange(searchTerm)
            }
        }, 700);

        return () => clearTimeout(delay);
    }, [searchTerm]);

    const openSearchBar = () => {
        setIsSearchOpen(true);
    }

    return (
        <>
            <header className={styles.header}>
                <NextLink href={'/'} className={'logo'}>
                    <div className={styles.header__logo}>
                        <Image width={29} height={29} src="/images/logo.svg" alt="logo"/>
                    </div>
                </NextLink>
                <ul className={styles.header__cta}>
                    { !isSearchOpen && (
                        <li className={styles.header__item} onClick={() => openSearchBar()}>
                            <Image width={29} height={29} src="/images/search.svg" />
                            <span className={styles.header__title}>Поиск</span>
                        </li>
                    ) }
                    <NextLink className={''} href={'/favorite'}>
                        <li className={styles.header__item}>
                            <Image width={29} height={29} src="/images/favorite.svg" />
                            <span className={styles.header__title}>Избранное</span>
                        </li>
                    </NextLink>
                    <li className={styles.header__item}>
                        <Image width={29} height={29} src="/images/search-history.svg" />
                        <span className={styles.header__title}>История поиска</span>
                    </li>
                </ul>
            </header>
            <AnimatePresence initial={false}>
                { isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 160, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{duration: 0.2}}

                        ref={divRef}
                        className={styles.header__search}>
                        <input type="text" className={styles.search__field} placeholder="Поиск" value={searchTerm} onChange={(event) => setSearchTerm(event?.currentTarget?.value)}/>
                        <div className={styles.search__category}>
                            {words.split(' ').map((word, index) => {
                                return (
                                    <span key={`word${index}`}>{word} </span>
                                )
                            })}
                        </div>
                    </motion.div>)
                }
            </AnimatePresence>
        </>
    );
});

