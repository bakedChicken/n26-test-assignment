import * as React from "react";

export function Root(): JSX.Element {
  const [response, setResponse] = React.useState(null);

  React.useEffect(() => {
    fetch(`/api/applications`)
      .then((r: Response) => r.json())
      .then(setResponse)
      .catch(console.error);
  }, []);

  return <p>Hello world! Server returned: {JSON.stringify(response)}</p>;
}
