import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import MovieDetailsModal from '../component/MovieDetailsModal';

const API_KEY = 'c856834ab20ef843559b338e1eb3db43';

const ReleaseCalendarScreen = () => {
  const [releases, setReleases] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  // ✅ Auto-select first available movie date
  useEffect(() => {
    if (Object.keys(releases).length && !selectedDate) {
      const sortedDates = Object.keys(releases).sort();
      setSelectedDate(sortedDates[0]);
    }
  }, [releases]);

  const fetchUpcomingMovies = async () => {
    try {
      let allResults = [],
        page = 1;

      while (page <= 3) {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming`,
          {
            params: { api_key: API_KEY, region: 'IN', page },
          },
        );
        allResults = [...allResults, ...res.data.results];
        page++;
      }

      const grouped = {};
      allResults.forEach(movie => {
        const date = movie.release_date;
        if (date) {
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(movie);
        }
      });

      setReleases(grouped);
    } catch (err) {
      console.error('Error fetching upcoming movies:', err);
      Alert.alert('Error', 'Failed to load upcoming movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleDatePress = date => setSelectedDate(date.dateString);

  // ✅ Caching: Avoid refetching if already fetched
  const openMovieModal = async movie => {
    if (selectedMovie?.id === movie.id && cast.length && genres.length) {
      setModalVisible(true);
      return;
    }

    setSelectedMovie(movie);
    setCast([]);
    setGenres([]);

    try {
      const [creditsRes, movieRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`,
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`,
        ),
      ]);
      setCast(creditsRes.data.cast.slice(0, 5));
      setGenres(movieRes.data.genres || []);
    } catch (err) {
      console.error('Movie detail fetch error:', err);
      Alert.alert('Error', 'Failed to load movie details.');
    }

    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Calendar
          onDayPress={handleDatePress}
          markedDates={{
            ...Object.keys(releases).reduce((acc, date) => {
              acc[date] = { marked: true, dotColor: '#FACC15' };
              return acc;
            }, {}),
            ...(selectedDate && {
              [selectedDate]: {
                selected: true,
                selectedColor: '#3B82F6',
                selectedTextColor: '#fff',
              },
            }),
          }}
          theme={{
            backgroundColor: '#0F172A',
            calendarBackground: '#0F172A',
            textSectionTitleColor: '#38BDF8',
            todayTextColor: '#F43F5E',
            dayTextColor: '#E2E8F0',
            textDisabledColor: '#475569',
            dotColor: '#FACC15',
            selectedDotColor: '#FACC15',
            arrowColor: '#FACC15',
            monthTextColor: '#FACC15',
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="gray"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={releases[selectedDate] || []}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => openMovieModal(item)}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subTitle}>
                  Release: {item.release_date}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No releases on this day</Text>
            }
            contentContainerStyle={{ padding: 10 }}
          />
        )}

        <MovieDetailsModal
          visible={modalVisible}
          movie={selectedMovie}
          cast={cast}
          genres={genres}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReleaseCalendarScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 12,
    borderColor: '#3B82F6',
    borderWidth: 1,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FACC15',
    marginBottom: 4,
  },
  subTitle: { fontSize: 14, color: '#CBD5E1' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#E2E8F0',
    fontStyle: 'italic',
  },
});
