import TrendFeedSearchListItem from "./TrendFeedSearchListItem"

const TrendFeedSearchList = ({results}) => {

  return (
    <div style={{margin: '30px auto'}}>
      {results && results.length !== 0 ?
        results.map((ele, idx) => { return (
          <TrendFeedSearchListItem feed={ele} key={idx} />
        )}) :
        <div>검색된 게시물이 없습니다.</div> 
      }
    </div>
  )
}

export default TrendFeedSearchList
