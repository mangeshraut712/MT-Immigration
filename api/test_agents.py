import os
import unittest

from fastapi import HTTPException

from api.agents import health, require_agent_secret


class AgentHealthTests(unittest.TestCase):
    def test_health_reports_readiness(self) -> None:
        payload = health()
        self.assertIs(payload["ok"], True)
        self.assertIn("ready", payload)
        self.assertIsInstance(payload["ready"], bool)

    def test_missing_shared_secret_is_unavailable(self) -> None:
        previous = os.environ.pop("FASTAPI_AGENT_SHARED_SECRET", None)
        try:
            with self.assertRaises(HTTPException) as raised:
                require_agent_secret(None)
            self.assertEqual(raised.exception.status_code, 503)
        finally:
            if previous is not None:
                os.environ["FASTAPI_AGENT_SHARED_SECRET"] = previous

    def test_wrong_shared_secret_is_unauthorized(self) -> None:
        previous = os.environ.get("FASTAPI_AGENT_SHARED_SECRET")
        os.environ["FASTAPI_AGENT_SHARED_SECRET"] = "expected-secret-value"
        try:
            with self.assertRaises(HTTPException) as raised:
                require_agent_secret("different-secret-value")
            self.assertEqual(raised.exception.status_code, 401)
        finally:
            if previous is None:
                os.environ.pop("FASTAPI_AGENT_SHARED_SECRET", None)
            else:
                os.environ["FASTAPI_AGENT_SHARED_SECRET"] = previous


if __name__ == "__main__":
    unittest.main()
