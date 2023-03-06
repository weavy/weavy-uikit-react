import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { WeavyContext } from "../contexts/WeavyContext";

interface IIndexable {
    url: string[],
    [key: string]: string[]
}

/// handle embeds
export default function useEmbeds(callback: Function) {
    const { client } = useContext(WeavyContext);
    const regexp = /(((https?|ftp):\/\/|(www|ftp)\.)[\w]+(.[\w]+)([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#]))/gmi;


    const [latest, setLatest] = useState<string[]>([])
    const [embeds, setEmbeds] = useState<string[]>([])
    const [failed, setFailed] = useState<string[]>([])
    const [rejected, setRejected] = useState<string[]>([])
    const [candidates, setCandidates] = useState<{ [string: string]: number }>({})

    if (!client) {
        throw new Error('useEmbeds must be used within an WeavyProvider');
    }

    const arrayEquals = (a: string[], b: string[]) =>
        a.length === b.length &&
        a.every((v, i) => v === b[i]);

    const fetchEmbed = async (url: string) => {
        const data = new FormData();
        data.append("url", url);

        try {

            const response = await client.post("/api/embeds",
                "POST",
                JSON.stringify({ url: url }));

            if (!response.ok) {
                throw new Error();
            }

            var json = await response.json();

            setEmbeds((prev) => [...prev, url]);
            setCandidates((prev) => {
                delete prev[url];
                return prev;
            });            
            callback(json);
        } catch (error) {
            // error, add to failed so that we don't fetch again
            setFailed((prev) => [...prev, url]);
            setCandidates((prev) => {
                delete prev[url];
                return prev;
            });

        }
    }

    const initEmbeds = (urls: string[]) =>{
        setEmbeds(urls);
    }
   
    const clearEmbeds = () => {
        setLatest([]);
        setEmbeds([]);
        setFailed([]);
        setRejected([]);
        setCandidates({});
    }

    const getEmbeds = async (content: string) => {

        let matches = content.match(regexp)?.map((match) =>match) || null;

        if (matches !== null) {
            matches = matches.map(url => {
                if (url.startsWith("//")) {
                    return "http:" + url;
                } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    return "http://" + url;
                } else {
                    return url;
                }
            });
        }

        if (matches === null || matches.length === 0) { // no matches     
            //console.log(latest, embeds, failed, candidates, rejected)
        } else if (matches.length !== latest.length || !arrayEquals(matches, latest)) { // matches has changed{
            // keep matches for comparing next time the doc is updated
            setLatest(matches);

            matches.forEach((match: string) => {                
                // add match if not already an embed, not failed or rejected before and not already a candidate 
                if (!embeds.includes(match) && !failed.includes(match) && !rejected.includes(match) && typeof (candidates[match]) === "undefined") {
                    setCandidates((prev) => {
                        prev[match] = setTimeout(() => { fetchEmbed(match); }, 500);
                        return prev;
                    });
                }
            });

            // remove from rejected
            setRejected((prev) => prev.filter(rejected => latest.includes(rejected)))

            // remove candidates
            for (let candidate in candidates) {
                if (!latest.includes(candidate)) {
                    clearTimeout(candidates[candidate]);
                    //delete candidates[candidate];
                    setCandidates((prev) => {
                        delete prev[candidate];
                        return prev;
                    });
                }
            }
        }
    };


    return { getEmbeds, initEmbeds, clearEmbeds };
}
