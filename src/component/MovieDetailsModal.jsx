import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('screen');

const MovieDetailsModal = ({ visible, movie, cast, genres, onClose }) => {
  if (!movie) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <Image
              source={{
                uri: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image',
              }}
              style={styles.poster}
              resizeMode="cover"
            />
            <Text style={styles.modalTitle}>{movie.title}</Text>
            <Text style={styles.subTitle}>
              Release Date: {movie.release_date}
            </Text>
            {genres.length > 0 && (
              <Text style={styles.genreText}>
                Genres: {genres.map(g => g.name).join(', ')}
              </Text>
            )}
            <Text style={styles.modalText}>
              {movie.overview || 'No overview available.'}
            </Text>
            <Text style={styles.castTitle}>Cast:</Text>
            {cast.map(actor => (
              <Text key={actor.id} style={styles.castItem}>
                {actor.name} as {actor.character}
              </Text>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MovieDetailsModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#38BDF8',
    elevation: 8,
  },
  poster: {
    width: width - 80,
    height: 320,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FACC15',
    textAlign: 'center',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  modalText: {
    fontSize: 15,
    color: '#F1F5F9',
    lineHeight: 22,
    textAlign: 'justify',
  },
  genreText: {
    fontSize: 14,
    color: '#CFFAFE',
    marginTop: 6,
    marginBottom: 10,
  },
  castTitle: {
    marginTop: 20,
    fontSize: 17,
    fontWeight: '700',
    color: '#38BDF8',
  },
  castItem: {
    fontSize: 15,
    marginTop: 6,
    color: '#E0F2FE',
  },
  closeButton: {
    backgroundColor: '#F43F5E',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
