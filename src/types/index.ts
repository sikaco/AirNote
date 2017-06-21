import * as React from 'react'

export interface EmptyProps {}

export interface FormInputEvent extends React.FormEvent<HTMLInputElement> {
  target: HTMLInputElement
}
