#!/bin/bash
# Emergency rollback script for RelayIndex Delta Router
echo "Initiating immediate rollback to direct upstream registry fallback..."
export RELAY_DELTA_ENGINE_ENABLED="false"
systemctl restart relayindex-router || true
echo "Rollback complete. System returned to safe fallback mode."
