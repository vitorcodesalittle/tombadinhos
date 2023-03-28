'use client'
import SearchInput from "../SearchInput"


const QuickStart = () => {
  return (
    <SearchInput onSearch={query => {
      console.log(query)
    }} />
  )

}

export default QuickStart
