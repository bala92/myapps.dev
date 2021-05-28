import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    // communication between PODS within the cluster but since
    // ingress-nginx-controller service(LoadBalancer) is in different namespace
    //base url <service-name>.<namespace>.svc.cluster.local
    return axios.create({
      baseURL:
        process.env.NODE_ENV !== "test"
          ? "https://www.whatsnow.xyz"
          : "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    // Outside the cluster, host file will take care of the domain mapping (in MAC OS its /etc/hosts)
    return axios.create({
      baseUrl: "/",
    });
  }
};
