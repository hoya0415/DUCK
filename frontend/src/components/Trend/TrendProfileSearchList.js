import TrendProfileSearchListItem from "./TrendProfileSearchListItem"

const TrendProfileSearchList = ({results}) => {

  return (
    <div style={{margin: '20px auto'}}>
      {results && results.length !== 0 ?
        results.map((ele, idx) => { return (
          <TrendProfileSearchListItem profile={ele} key={idx} />
        )}) :
        <div>검색된 프로필이 없습니다.</div> 
      }
    </div>
  )
}

export default TrendProfileSearchList