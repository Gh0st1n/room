import { useMemo } from "react";
import axios from 'axios';
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 1;

export default function DiscussionFlow(){
    const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
      (pageIndex, previousPageData)=>{
        // reach the end
        if(previousPageData && !previousPageData.discussionNodes.length) return null;
        console.log(pageIndex, previousPageData);
        // first page
        if(pageIndex === 0) return `/api/discussions?first=${PAGE_SIZE}`;
        // add cursor to the API endpoint
        return `/api/discussions?first=${PAGE_SIZE}&after=${previousPageData.discussionNodes[previousPageData.discussionNodes.length-1].cursor}`
      })
  
  
    const discussions = useMemo(()=>{
      return data?.reduce((acc, val)=>{
        return [...acc, ...val.discussionNodes]
      },[]) ?? []
    },[data])
  
    // TODO 通过按钮或者滚动加载更多
    const loadMore = ()=>{
      console.log('load more')
      setSize(size+1)
    }
    return <div className="mx-6 h-full">
            {discussions.map((node) => {
              return (
                <div
                  className="my-4 bg-blue-400"
                  style={{ minHeight: "1000px" }}
                  key={node.id}
                  dangerouslySetInnerHTML={{ __html: node.bodyHTML }}
                />
              );
            })}
            <div className="text-red-600" onClick={loadMore}>load more</div>
          </div>
}