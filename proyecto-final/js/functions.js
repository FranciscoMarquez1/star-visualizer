var mat = new THREE.LineBasicMaterial({
  color: '#40e0d0'
});

var texture = THREE.ImageUtils.loadTexture( "textures/sprites/star1.png" );
texture.mapping = THREE.SphericalReflectionMapping;
texture.magFilter = THREE.LinearFilter;
texture.minFilter = THREE.NearestFilter;

var starMaterial = new THREE.PointsMaterial({
                        color: 0xffffff,
                        size: 32,
                        map: texture,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    });

var httpRequest2 = new XMLHttpRequest();
httpRequest2.onreadystatechange = function() {
  if (httpRequest2.readyState === 4) {
    constellationData = JSON.parse(httpRequest2.responseText);

    var lumsh = [];

    for (var k=0; k<constellationData.length; k++) {
      var objectGroup =  new THREE.Object3D();
      var con = constellationData[k];
      var stars = con.stars;

      var ppX = stars[0][1].x * scaleFactor,
          ppY = stars[0][1].y * scaleFactor,
          ppZ = stars[0][1].z * scaleFactor;

      var pos = new THREE.Vector3( ppX, ppY, ppZ);


      let name = con.abbr;

      if (con.hasOwnProperty('name')) {
        name = con.name;
      }
      var info = con.info

      //TODO: add marker
      // set marker text color: white, do this in css
      Markers.addMarker(pos, name, camera, info);

      for (var i=0; i<stars.length; i++) {
        let geometry = new THREE.Geometry();
        let new_stars = new THREE.Geometry();
        var star = stars[i];
        for (var j=0; j<star.length; j++) {
          var s = star[j];
          var v = new THREE.Vector3(
            s.x * scaleFactor,
            s.y * scaleFactor,
            s.z * scaleFactor);
          geometry.vertices.push(v);
          var pX = s.x * scaleFactor,
              pY = s.y * scaleFactor,
              pZ = s.z * scaleFactor;
          var vertex = new THREE.Vector3(pX, pY, pZ);
          new_stars.vertices.push(vertex);
        }

        connector = new THREE.Line(geometry, mat);
        connector.name = "Connector"+lineCount;
        points = new THREE.Points(new_stars, starMaterial);

        objectGroup.add(points);
        objectGroup.add(connector);
        lineCount++;
      }
      obj =  new Object()
      obj.object = objectGroup;
      obj.name = name;
      obj.abbr =  con.abbr;
      constellationsGroups.push(obj);
    
    }
    for(let i=0; i<constellationsGroups.length; i++){
      scene.add(constellationsGroups[i].object);
      parameters[constellationsGroups[i].abbr] = function () {
        offset = 1.25;
        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject(constellationsGroups[i].object);
        const center = boundingBox.getCenter();

        camera.updateProjectionMatrix();

        camera.lookAt(center);

      }

      gui.add( parameters, constellationsGroups[i].abbr).name(constellationsGroups[i].name);
    }
  }
}
