# Copyright 2014 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for the admin page."""

from core.domain import collection_services
from core.domain import config_domain
from core.domain import exp_domain
from core.domain import exp_services
from core.domain import search_services
from core.domain import stats_domain
from core.domain import stats_services
from core.tests import test_utils
import feconf

BOTH_MODERATOR_AND_ADMIN_EMAIL = 'moderator.and.admin@example.com'
BOTH_MODERATOR_AND_ADMIN_USERNAME = 'moderatorandadm1n'


class AdminIntegrationTest(test_utils.GenericTestBase):
    """Server integration tests for operations on the admin page."""

    def setUp(self):
        """Complete the signup process for self.ADMIN_EMAIL."""
        super(AdminIntegrationTest, self).setUp()
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.signup(self.EDITOR_EMAIL, self.EDITOR_USERNAME)

    def test_admin_page_rights(self):
        """Test access rights to the admin page."""

        self.get_html_response('/admin', expected_status_int=302)

        # Login as a non-admin.
        self.login(self.EDITOR_EMAIL)
        self.get_html_response('/admin', expected_status_int=401)
        self.logout()

        # Login as an admin.
        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        self.get_html_response('/admin')
        self.logout()

    def test_change_configuration_property(self):
        """Test that configuration properties can be changed."""

        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        csrf_token = self.get_csrf_token()
        new_config_value = True

        response_dict = self.get_json('/adminhandler')
        response_config_properties = response_dict['config_properties']
        self.assertDictContainsSubset({
            'value': False,
        }, response_config_properties[
            config_domain.IS_IMPROVEMENTS_TAB_ENABLED.name])

        payload = {
            'action': 'save_config_properties',
            'new_config_property_values': {
                config_domain.IS_IMPROVEMENTS_TAB_ENABLED.name: (
                    new_config_value),
            }
        }
        self.post_json('/adminhandler', payload, csrf_token=csrf_token)

        response_dict = self.get_json('/adminhandler')
        response_config_properties = response_dict['config_properties']
        self.assertDictContainsSubset({
            'value': new_config_value,
        }, response_config_properties[
            config_domain.IS_IMPROVEMENTS_TAB_ENABLED.name])

        self.logout()


class GenerateDummyExplorationsTest(test_utils.GenericTestBase):
    """Test the conditions for generation of dummy explorations."""

    def test_generate_count_greater_than_publish_count(self):
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        csrf_token = self.get_csrf_token()
        self.post_json(
            '/adminhandler', {
                'action': 'generate_dummy_explorations',
                'num_dummy_exps_to_generate': 10,
                'num_dummy_exps_to_publish': 3
            }, csrf_token=csrf_token)
        generated_exps = exp_services.get_all_exploration_summaries()
        published_exps = exp_services.get_recently_published_exp_summaries(5)
        self.assertEqual(len(generated_exps), 10)
        self.assertEqual(len(published_exps), 3)

    def test_generate_count_equal_to_publish_count(self):
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        csrf_token = self.get_csrf_token()
        self.post_json(
            '/adminhandler', {
                'action': 'generate_dummy_explorations',
                'num_dummy_exps_to_generate': 2,
                'num_dummy_exps_to_publish': 2
            }, csrf_token=csrf_token)
        generated_exps = exp_services.get_all_exploration_summaries()
        published_exps = exp_services.get_recently_published_exp_summaries(5)
        self.assertEqual(len(generated_exps), 2)
        self.assertEqual(len(published_exps), 2)

    def test_generate_count_less_than_publish_count(self):
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        csrf_token = self.get_csrf_token()
        generated_exps_response = self.post_json(
            '/adminhandler', {
                'action': 'generate_dummy_explorations',
                'num_dummy_exps_to_generate': 2,
                'num_dummy_exps_to_publish': 5
            },
            csrf_token=csrf_token, expected_status_int=400)
        self.assertEqual(generated_exps_response['status_code'], 400)
        generated_exps = exp_services.get_all_exploration_summaries()
        published_exps = exp_services.get_recently_published_exp_summaries(5)
        self.assertEqual(len(generated_exps), 0)
        self.assertEqual(len(published_exps), 0)


class AdminRoleHandlerTest(test_utils.GenericTestBase):
    """Checks the user role handling on the admin page."""

    def setUp(self):
        """Complete the signup process for self.ADMIN_EMAIL."""
        super(AdminRoleHandlerTest, self).setUp()
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.set_admins([self.ADMIN_USERNAME])

    def test_view_and_update_role(self):
        user_email = 'user1@example.com'
        username = 'user1'

        self.signup(user_email, username)

        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        # Check normal user has expected role. Viewing by username.
        response_dict = self.get_json(
            feconf.ADMIN_ROLE_HANDLER_URL,
            params={'method': 'username', 'username': 'user1'})
        self.assertEqual(
            response_dict, {'user1': feconf.ROLE_ID_EXPLORATION_EDITOR})

        # Check role correctly gets updated.
        csrf_token = self.get_csrf_token()
        response_dict = self.post_json(
            feconf.ADMIN_ROLE_HANDLER_URL,
            {'role': feconf.ROLE_ID_MODERATOR, 'username': username},
            csrf_token=csrf_token,
            expected_status_int=200)
        self.assertEqual(response_dict, {})

        # Viewing by role.
        response_dict = self.get_json(
            feconf.ADMIN_ROLE_HANDLER_URL,
            params={'method': 'role', 'role': feconf.ROLE_ID_MODERATOR})
        self.assertEqual(response_dict, {'user1': feconf.ROLE_ID_MODERATOR})
        self.logout()

    def test_invalid_username_in_view_and_update_role(self):
        username = 'myinvaliduser'

        self.login(self.ADMIN_EMAIL, is_super_admin=True)

        # Trying to view role of non-existent user.
        self.get_json(
            feconf.ADMIN_ROLE_HANDLER_URL,
            params={'method': 'username', 'username': username},
            expected_status_int=400)

        # Trying to update role of non-existent user.
        csrf_token = self.get_csrf_token()
        self.post_json(
            feconf.ADMIN_ROLE_HANDLER_URL,
            {'role': feconf.ROLE_ID_MODERATOR, 'username': username},
            csrf_token=csrf_token,
            expected_status_int=400)


class DataExtractionQueryHandlerTests(test_utils.GenericTestBase):
    """Tests for data extraction handler."""

    EXP_ID = 'exp'

    def setUp(self):
        """Complete the signup process for self.ADMIN_EMAIL."""
        super(DataExtractionQueryHandlerTests, self).setUp()
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.signup(self.EDITOR_EMAIL, self.EDITOR_USERNAME)
        self.editor_id = self.get_user_id_from_email(self.EDITOR_EMAIL)
        self.exploration = self.save_new_valid_exploration(
            self.EXP_ID, self.editor_id, end_state_name='End')

        stats_services.record_answer(
            self.EXP_ID, self.exploration.version,
            self.exploration.init_state_name, 'TextInput',
            stats_domain.SubmittedAnswer(
                'first answer', 'TextInput', 0,
                0, exp_domain.EXPLICIT_CLASSIFICATION, {},
                'a_session_id_val', 1.0))

        stats_services.record_answer(
            self.EXP_ID, self.exploration.version,
            self.exploration.init_state_name, 'TextInput',
            stats_domain.SubmittedAnswer(
                'second answer', 'TextInput', 0,
                0, exp_domain.EXPLICIT_CLASSIFICATION, {},
                'a_session_id_val', 1.0))

    def test_data_extraction_handler(self):
        self.login(self.ADMIN_EMAIL, is_super_admin=True)

        # Test that it returns all answers when 'num_answers' is 0.
        payload = {
            'exp_id': self.EXP_ID,
            'exp_version': self.exploration.version,
            'state_name': self.exploration.init_state_name,
            'num_answers': 0
        }

        response = self.get_json(
            '/explorationdataextractionhandler', params=payload)
        extracted_answers = response['data']
        self.assertEqual(len(extracted_answers), 2)
        self.assertEqual(extracted_answers[0]['answer'], 'first answer')
        self.assertEqual(extracted_answers[1]['answer'], 'second answer')

        # Make sure that it returns only 'num_answers' number of answers.
        payload = {
            'exp_id': self.EXP_ID,
            'exp_version': self.exploration.version,
            'state_name': self.exploration.init_state_name,
            'num_answers': 1
        }

        response = self.get_json(
            '/explorationdataextractionhandler', params=payload)
        extracted_answers = response['data']
        self.assertEqual(len(extracted_answers), 1)
        self.assertEqual(extracted_answers[0]['answer'], 'first answer')

    def test_that_handler_raises_exception(self):
        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        payload = {
            'exp_id': self.EXP_ID,
            'exp_version': self.exploration.version,
            'state_name': 'state name',
            'num_answers': 0
        }

        response = self.get_json(
            '/explorationdataextractionhandler', params=payload,
            expected_status_int=400)

        self.assertEqual(
            response['error'],
            'Exploration \'exp\' does not have \'state name\' state.')


class ClearSearchIndexTest(test_utils.GenericTestBase):
    """Tests that search index gets cleared."""

    def test_clear_search_index(self):
        exp_services.load_demo('0')
        result_explorations = search_services.search_explorations(
            'Welcome', 2)[0]
        self.assertEqual(result_explorations, ['0'])
        collection_services.load_demo('0')
        result_collections = search_services.search_collections('Welcome', 2)[0]
        self.assertEqual(result_collections, ['0'])
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.login(self.ADMIN_EMAIL, is_super_admin=True)
        csrf_token = self.get_csrf_token()
        generated_exps_response = self.post_json(
            '/adminhandler', {
                'action': 'clear_search_index'
            },
            csrf_token=csrf_token)
        self.assertEqual(generated_exps_response, {})
        result_explorations = search_services.search_explorations(
            'Welcome', 2)[0]
        self.assertEqual(result_explorations, [])
        result_collections = search_services.search_collections('Welcome', 2)[0]
        self.assertEqual(result_collections, [])
