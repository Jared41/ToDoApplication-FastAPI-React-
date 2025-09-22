from datetime import date


def test_health(client):
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'healthy'


def test_create_and_list_users(client):
    payload = {
        "firstname": "John",
        "lastname": "Doe",
        "age": 30,
        "date_of_birth": str(date(1995, 1, 1))
    }

    r = client.post('/users/create', json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data['id'] > 0
    assert data['firstname'] == 'John'
    assert data['lastname'] == 'Doe'
    assert data['age'] == 30
    assert data['date_of_birth'] == str(date(1995, 1, 1))

    r2 = client.get('/users')
    assert r2.status_code == 200
    users = r2.json()
    assert len(users) == 1
    assert users[0]['firstname'] == 'John'


def test_delete_user(client):
    # create
    payload = {
        "firstname": "Jane",
        "lastname": "Doe",
        "age": 25,
        "date_of_birth": str(date(2000, 2, 2))
    }
    r = client.post('/users/create', json=payload)
    assert r.status_code == 200
    user_id = r.json()['id']

    # delete
    r2 = client.request('DELETE', '/user', json={"id": user_id})
    assert r2.status_code == 200
    assert 'deleted' in r2.json()['message'].lower()

    # verify
    r3 = client.get('/users')
    assert r3.status_code == 200
    assert all(u['id'] != user_id for u in r3.json())



def test_root_endpoint(client):
    r = client.get('/')
    assert r.status_code == 200
    assert r.json()['message'] == 'User Management API'


def test_create_user_missing_field(client):
    payload = {
        "firstname": "NoLast",
        # missing lastname
        "age": 20,
        "date_of_birth": str(date(2005, 1, 1))
    }
    r = client.post('/users/create', json=payload)
    assert r.status_code == 422


def test_create_user_invalid_date_format(client):
    payload = {
        "firstname": "Bad",
        "lastname": "Date",
        "age": 40,
        # invalid month 13
        "date_of_birth": "1995-13-01"
    }
    r = client.post('/users/create', json=payload)
    assert r.status_code == 422


def test_delete_nonexistent_user(client):
    r = client.request('DELETE', '/user', json={"id": 999999})
    assert r.status_code == 404
    assert r.json().get('detail') == 'User not found'


def test_user_response_contains_required_fields(client):
    payload = {
        "firstname": "Fields",
        "lastname": "Check",
        "age": 22,
        "date_of_birth": str(date(2003, 3, 3))
    }
    r = client.post('/users/create', json=payload)
    assert r.status_code == 200
    data = r.json()
    assert set(data.keys()) == {"id", "firstname", "lastname", "age", "date_of_birth"}
