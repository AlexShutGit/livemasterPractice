<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Livemaster | Практикум</title>
		<link href="/favicon.ico" rel="shortcut icon">

		<link rel="stylesheet" href="{{ webpackAsset('vendor.css') }}">
		<script src="../../javascript/main.js"></script>
		{% block styles %}{% endblock %}

	</head>
	<body>
		<div class="wrapper">

			{% block content %}{% endblock %}

			 <script src="{{ webpackAsset('runtime.js') }}"></script>
			 <script src="{{ webpackAsset('vendor.js') }}"></script>

			{% block scripts %}{% endblock %}
		</div>

		{% block footerAssets %}{% endblock %}
	</body>
</html>