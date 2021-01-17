FROM mongo:4.4.3
ADD mongodb/scripts/init_replicaset.js init_replicaset.js
