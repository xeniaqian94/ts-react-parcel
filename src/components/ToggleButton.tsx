import * as React from "react"
interface WelcomeProps {
 note: string,
}
const Welcome: React.SFC<WelcomeProps> = (props) => {
 return <h1>Hello, {props.note}</h1>;
}