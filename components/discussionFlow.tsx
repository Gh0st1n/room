import { useCallback, useEffect, useMemo } from "react";
import axios from 'axios';
import useSWRInfinite from "swr/infinite";
import { IDiscussion } from "../lib/types/adapter";
import { useInView } from 'react-intersection-observer';

const PAGE_SIZE = 1;
const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function DiscussionFlow(){
    const { ref, inView } = useInView({
        threshold: 0,
    });
    const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
      (pageIndex, previousPageData)=>{
        // reach the end
        if(previousPageData && !previousPageData.discussionNodes.length) return null;
        // first page
        if(pageIndex === 0) return `/api/discussions?first=${PAGE_SIZE}`;
        console.log('fetcher',pageIndex, previousPageData);
        // add cursor to the API endpoint
        return `/api/discussions?first=${PAGE_SIZE}&after=${previousPageData.discussionNodes[previousPageData.discussionNodes.length-1].cursor}`
      }, fetcher ,{
        revalidateFirstPage: false // not to repeat request the first page
      })
  
  
    const discussions = useMemo(()=>{
      return data?.reduce((acc, val)=>{
        return [...acc, ...val.discussionNodes]
      },[]) ?? []
    },[data])

    const isEmpty = useMemo(()=>(data?.[0].discussionNodes?.length === 0),[data]);
    const isReachingEnd = useMemo(()=>(isEmpty || (data && data[data.length - 1]?.discussionNodes.length < PAGE_SIZE)),[data, isEmpty]);
    const enableLoadMore = useMemo(()=>(!isLoading && !isReachingEnd),[isLoading, isReachingEnd]);

    // TODO 通过按钮或者滚动加载更多
    const loadMore = ()=>{
      console.log('load more')
      setSize(size+1)
    }

    useEffect(()=>{
        if(inView){
            console.log('inView',size);
            setSize(size+1)
        }
    },[inView])

    return <div className="mx-6 h-full">
        {discussions.map((node: IDiscussion) => {
            return (
            <div
                className="my-4 bg-blue-400"
                style={{ minHeight: "1000px" }}
                key={node.id}
                dangerouslySetInnerHTML={{ __html: node.bodyHTML }}
            />
            );
        })}
        <div className="text-red-600" onClick={enableLoadMore? loadMore: ()=>{}} id="more" ref={ref}>
            {
                isValidating? 'loading...' : (isReachingEnd ? "that's all" : "load more")
            }
        </div>
    </div>
}