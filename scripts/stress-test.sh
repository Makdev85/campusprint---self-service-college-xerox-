#!/bin/bash
# ==============================================================================
# Capstone Live Demonstration: HPA Stress Test & Auto-scaling Generator
# ==============================================================================

TARGET_SERVICE="http://campus-xerox-service.campus-xerox.svc.cluster.local"

echo "=========================================================="
echo " Starting Load Generator for Horizontal Pod Autoscaling"
echo " Target: $TARGET_SERVICE"
echo "=========================================================="
echo "Tip: In another terminal, run:"
echo "  kubectl get hpa -n campus-xerox -w"
echo "  kubectl get pods -n campus-xerox -w"
echo "=========================================================="

# Launching inside Kubernetes as a temporary job or pod
kubectl run load-generator \
  --namespace=campus-xerox \
  --image=busybox:1.28 \
  --restart=Never \
  -- /bin/sh -c "while true; do wget -q -O- http://campus-xerox-service; done"

echo ""
echo "Load generator pod created and running!"
echo "Watch HPA metrics scale up now with:"
echo "  kubectl get hpa -n campus-xerox -w"
echo ""
echo "To STOP the test and watch pods scale back down, run:"
echo "  kubectl delete pod load-generator -n campus-xerox"
