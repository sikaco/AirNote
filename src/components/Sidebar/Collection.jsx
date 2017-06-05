import React from 'react'

function CollectionHead({name}) {
  return (
    <div>
      <div className="collection-icon">

      </div>
      <div className="collection-title">
        {name}
      </div>
      <div className="collection-number">

      </div>
    </div>
  )
}

function CollectionItem() {
  return (
    <div> </div>
  )
}

function CollectionList() {
  return (
    <CollectionItem/>
  )
}

export function Collection({name}) {
  return (
    <div>
      <CollectionHead name={name}/>
      <CollectionList/>
    </div>
  )
}


function NoteBook() {
  return (
    <div> </div>
  )
}

function NoteBookList() {
  return (
    <NoteBook/>
  )
}

export function NoteBooksCollection({name}) {
  return (
    <div>
      <CollectionHead name={name}/>
      <NoteBookList/>
    </div>
  )
}